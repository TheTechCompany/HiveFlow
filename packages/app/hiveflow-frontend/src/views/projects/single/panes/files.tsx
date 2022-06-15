import { FileExplorer, FileDialog } from "@hexhive/ui";
import { Divider, Menu, MenuItem } from "@mui/material";
import { FolderModal } from "../../../../modals/folder-modal";
import { Box } from "grommet";
import React, { useState } from "react";
import { useMutation } from "@hive-flow/api";
import { useMutation as useApolloMutation, useQuery, gql, useApolloClient } from "@apollo/client";
import { useProjectInfo } from "../context";
import { FilePreviewDialog } from "../../../../modals/file-preview";

export const FilePane = () => {

    const { projectId } = useProjectInfo();

    const client = useApolloClient()

    const [activePath, setActivePath] = useState('/');

    const [createFolderOpen, openCreateFolder] = useState<boolean>(false)
    const [filePreviewOpen, openFilePreview] = useState<any>(null)

    const [anchorPos, setAnchorPos] = useState<{ top: number, left: number }>()

    const [createDirectory] = useMutation((mutation, args: any) => {
        const item = mutation.createProjectFolder({ project: projectId, path: `${activePath}/${args.path}` })
        return {
            item: {
                ...item
            }
        }
    })

    const [uploadFiles] = useApolloMutation(gql`
        mutation UploadFile($project: ID!, $path: String, $files: [Upload]){
            uploadProjectFiles(project: $project, path: $path, files: $files){
                id
                name
            }
        }
    `)

    const { data } = useQuery(gql`
        query GetProjectFiles($id: String, $path: String) {
            projects(where: {displayId: $id}){
            
                files(path: $path) {
                    id
                    name
                    directory
                    size
                }
            
            }
        }
    `, {
        variables: {
            id: projectId,
            path: activePath
        }
    })

    const refetch = () => {
        client.refetchQueries({include: ['GetProjectFiles']})
    };
    

    const files = data?.projects?.[0]?.files || [];

    return (

        <Box flex onContextMenu={(evt) => {
            evt.preventDefault()
            setAnchorPos({ top: evt.clientY, left: evt.clientX })
          }}>
            <FolderModal
              open={createFolderOpen}
              onClose={() => {
                openCreateFolder(false)
              }}
              onSubmit={(folder) => {
                createDirectory({
                  args: {
                    path: folder.name
                  }
                }).then(() => {
                  openCreateFolder(false)
                  refetch()
                })
              }}
            />
            <FilePreviewDialog
                open={Boolean(filePreviewOpen)}
                onClose={() => openFilePreview(null)}
                files={filePreviewOpen ? [filePreviewOpen.id] : []}
                />
            
            <Menu
              anchorReference={'anchorPosition'}
              anchorPosition={anchorPos}
              open={Boolean(anchorPos)}
              onClose={() => setAnchorPos(undefined)}
            >
              <MenuItem onClick={() => {
                openCreateFolder(true)
                setAnchorPos(undefined)
              }}>New Folder</MenuItem>
              <Divider />
              <MenuItem onClick={() => {
                setAnchorPos(undefined)
              }} style={{ color: 'red' }}>Delete</MenuItem>
            </Menu>
            <FileExplorer
              path={activePath}
              previewEngines={[
                {
                  filetype: '.png',
                  component: ({ file }) => <Box>file</Box>
                }
              ]}
              onClick={(file) => {
                openFilePreview(file)
              }}
              onNavigate={(path) => {
                setActivePath(path)
              }}
              files={files?.map((x: any) => ({ ...x, isFolder: x.directory })) || []}
              onDrop={(files) => {
                uploadFiles({
                  variables: {
                    project: projectId,
                    path: activePath,
                    files
                  }
                }).then(() => {
                  refetch()
                })
              }}
            />
          </Box>
        
    )
}